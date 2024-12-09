document.addEventListener("DOMContentLoaded", function() {
    let products;

    // Fetch product data from mock API
    fetch('https://mocki.io/v1/0d96b1ad-1c02-423d-bad8-fdde2f837719')
        .then(response => response.json())
        .then(data => {
            products = data.products; 

            // Displaying first product 
            const product = products[0]; 
            // Displays product details
            displayProductOverview(product);
            // Display review summary for the product
            displayReviewSummary(product.reviews);
            // Display user reviews for the product
            displayUserReviews(product.reviews);

            // Add filter functionality for reviews based on rating
            document.getElementById('review-filter').addEventListener('change', function() {
                const selectedRating = this.value;// Get the selected rating filter
                const filteredReviews = selectedRating === 'all' 
                    ? product.reviews 
                    : product.reviews.filter(review => review.star_rating == selectedRating);
                displayUserReviews(filteredReviews);
            });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });

    // Display Product Overview
    function displayProductOverview(product) {
        document.getElementById('product-image').src = product.image_url;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-description').textContent = product.description;
    }

    // Display Review Summary
    function displayReviewSummary(reviews) {
        const totalReviews = reviews.length;
        const totalStars = reviews.reduce((sum, review) => sum + review.star_rating, 0);
        const averageRating = (totalStars / totalReviews).toFixed(1);

        document.getElementById('rating-summary').textContent = `Average Rating: ${averageRating} out of 5`;

        const starBreakdown = getStarBreakdown(reviews);
        displayStarRatingBreakdown(starBreakdown, totalReviews);
    }

    // Get breakdown of star ratings
    function getStarBreakdown(reviews) {
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        reviews.forEach(review => {
            breakdown[review.star_rating]++;
        });

        return breakdown;
    }

    // Display star rating breakdown
    function displayStarRatingBreakdown(starBreakdown, totalReviews) {
        const starRatingBreakdownDiv = document.getElementById('star-rating-breakdown');
        starRatingBreakdownDiv.innerHTML = ''; 

        // Loop through star ratings from 5 to 1
        for (let stars = 5; stars >= 1; stars--) {
            const starCount = starBreakdown[stars];
            const percentage = ((starCount / totalReviews) * 100).toFixed(1);

            // Create and append a new div showing the breakdown for each star rating
            const breakdownItem = document.createElement('div');
            breakdownItem.innerHTML = `
                <strong>${stars} Stars</strong>
                <div style="width: 100px; background: #ddd;">
                    <div style="width: ${percentage}%; background: gold; height: 20px;"></div>
                </div>
                <p>${starCount} Reviews (${percentage}%)</p>
            `;
            starRatingBreakdownDiv.appendChild(breakdownItem);
        }
    }

    // Display User Reviews
    function displayUserReviews(reviews) {
        const reviewsDiv = document.getElementById('reviews');
        reviewsDiv.innerHTML = ''; 

        reviews.forEach((review, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review');
            reviewItem.innerHTML = `
                <h4>${review.user_name}</h4>
                <p>Rating: ${review.star_rating} Stars</p>
                <p>${review.review_text}</p>
                <p><small>Reviewed on: ${review.review_date}</small></p>
                <button class="like-button" data-index="${index}">Like (${review.likes || 0})</button>
                <hr />
            `;
            reviewsDiv.appendChild(reviewItem);
        });

        // Add event listeners to all "Like" buttons
        const likeButtons = document.querySelectorAll('.like-button');
        likeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reviewIndex = this.getAttribute('data-index');
                handleLikeClick(reviewIndex);
            });
        });
    }

    // Handle like button click
    function handleLikeClick(reviewIndex) {
        const product = products[0]; 
        const review = product.reviews[reviewIndex];

        // Ensure likes property exists and increment it
        review.likes = review.likes || 0; // If likes is undefined, initialize it to 0
        review.likes++; // Increment the like count

        // Re-render the reviews with updated like count
        displayUserReviews(product.reviews);
    }

    // Handle new review submission
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const userName = document.getElementById('user-name').value;
        const starRating = parseInt(document.getElementById('star-rating').value);
        const reviewText = document.getElementById('review-text').value;
        const reviewDate = new Date().toISOString().split('T')[0]; // Current date

        // Validation: Ensure all fields are filled
        if (!userName || !starRating || !reviewText) {
            alert('Please fill in all fields!');
            return;
        }

        const newReview = {
            user_name: userName,
            star_rating: starRating,
            review_text: reviewText,
            review_date: reviewDate,
            likes: 0 // Initialize likes count
        };

        const product = products[0]; 

        // Add the new review to the product
        product.reviews.push(newReview);

        // Re-render reviews and review summary
        displayReviewSummary(product.reviews);
        displayUserReviews(product.reviews);

        // Add animation for newly added review
        const reviewsDiv = document.getElementById('reviews');
        const newReviewDiv = document.createElement('div');
        newReviewDiv.classList.add('review', 'new-review'); // Add animation class
        newReviewDiv.innerHTML = `
            <h4>${newReview.user_name}</h4>
            <p>Rating: ${newReview.star_rating} Stars</p>
            <p>${newReview.review_text}</p>
            <p><small>Reviewed on: ${newReview.review_date}</small></p>
            <button class="like-button" data-index="${product.reviews.length - 1}">Like (0)</button>
            <hr />
        `;
        reviewsDiv.appendChild(newReviewDiv);

        // Clear the form after submission
        reviewForm.reset();
    });
});
