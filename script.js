const apiUrl = 'https://mocki.io/v1/34cb0402-0510-4978-b601-d2921936a99e';

document.addEventListener('DOMContentLoaded', () => {
    let selectedProduct = null; // Store the selected product
    let products = []; // Store all products

    // Fetch and store products data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            products = data.products; // Store the fetched products
            displayProducts(products); // Display the product list
        })
        .catch(error => console.error('Error fetching product data:', error));

    // Function to display the list of products
    function displayProducts(products) {
        const productList = document.getElementById('product-list');
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button onclick="viewProductDetails(${product.id})">Check Review</button>
            `;
            productList.appendChild(productItem);
        });
    }

    // Function to show detailed product information and reviews
    window.viewProductDetails = function(productId) {
        const product = products.find(p => p.id === productId); // Find the selected product
        selectedProduct = product; // Store the selected product
        displayProductDetails(product); // Display product details
        displayReviewSummary(product.reviews); // Display the review summary
        setupReviewFilter(product.reviews); // Setup review filter functionality
    };

    // Function to display the selected product details and reviews
    function displayProductDetails(product) {
        document.getElementById('product-overview').style.display = 'none'; 
        document.getElementById('review-details').style.display = 'block'; 

        document.getElementById('product-image').src = product.image_url;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-description').textContent = product.description;

        // Display all reviews for the product
        const reviewsContainer = document.getElementById('reviews');
        reviewsContainer.innerHTML = ''; 
        product.reviews.forEach(review => {
            const reviewItem = createReviewItem(review, product); // Create review items
            reviewsContainer.appendChild(reviewItem);
        });

        // Add functionality to go back to product overview
        document.getElementById('back-button').addEventListener('click', () => {
            document.getElementById('product-overview').style.display = 'block'; 
            document.getElementById('review-details').style.display = 'none'; 
        });
    }

    // Function to create a review item with like button functionality
    function createReviewItem(review, product) {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        reviewItem.innerHTML = `
            <p><strong>${review.user_name}</strong></p>
            <p>Rating: ${review.star_rating} Stars</p>
            <p>${review.review_text}</p>
            <p>Reviewed on: <small>${review.review_date}</small></p>
            <button class="like-button" data-likes="${review.likes || 0}">Like (<span class="like-count">${review.likes || 0}</span>)</button>
        `;

        // Add functionality to like a review
        const likeButton = reviewItem.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            let likeCount = parseInt(likeButton.dataset.likes); 
            likeCount++;
            likeButton.dataset.likes = likeCount; 
            likeButton.querySelector('.like-count').textContent = likeCount; 

            // Update the like count in the product's review data
            const reviewIndex = product.reviews.findIndex(r => r.user_name === review.user_name && r.review_text === review.review_text);
            if (reviewIndex !== -1) {
                product.reviews[reviewIndex].likes = likeCount; // Update likes for the review
            }
        });

        return reviewItem; // Return the created review item
    }

    // Function to display the review summary with average rating
    function displayReviewSummary(reviews) {
        const totalReviews = reviews.length; 
        const totalStars = reviews.reduce((sum, review) => sum + review.star_rating, 0); 
        const averageRating = (totalStars / totalReviews).toFixed(1); 

        // Display the average rating
        document.getElementById('rating-summary').textContent = `Average Rating: ${averageRating} out of 5`;

        // Get and display the breakdown of star ratings
        const starBreakdown = getStarBreakdown(reviews);
        displayStarRatingBreakdown(starBreakdown, totalReviews);
    }

    // Function to get the breakdown of star ratings
    function getStarBreakdown(reviews) {
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        reviews.forEach(review => {
            breakdown[review.star_rating]++; 
        });

        return breakdown; // Return the star rating breakdown
    }

    // Function to display the star rating breakdown as a percentage
    function displayStarRatingBreakdown(starBreakdown, totalReviews) {
        const starRatingBreakdownDiv = document.getElementById('star-rating-breakdown');
        starRatingBreakdownDiv.innerHTML = ''; 

        // Loop through each star rating (5 to 1)
        for (let stars = 5; stars >= 1; stars--) {
            const starCount = starBreakdown[stars]; 
            const percentage = ((starCount / totalReviews) * 100).toFixed(1); 

            // Create a div showing the breakdown for the current star rating
            const breakdownItem = document.createElement('div');
            breakdownItem.innerHTML = `
                <strong>${stars} Stars</strong>
                <div style="width: 100px; background: #ddd;">
                    <div style="width: ${percentage}%; background: gold; height: 20px;"></div>
                </div>
                <p>${starCount} Reviews (${percentage}%)</p>
            `;
            starRatingBreakdownDiv.appendChild(breakdownItem); // Append to the breakdown div
        }
    }

    // Function to set up the review filter functionality
    function setupReviewFilter(reviews) {
        const reviewFilter = document.getElementById('review-filter');
        reviewFilter.addEventListener('change', () => {
            const selectedRating = reviewFilter.value; // Get selected filter rating
            const filteredReviews = filterReviewsByRating(reviews, selectedRating); // Filter reviews by selected rating
            displayFilteredReviews(filteredReviews, selectedProduct); // Display filtered reviews
        });
    }

    // Function to filter reviews based on the selected rating
    function filterReviewsByRating(reviews, rating) {
        if (rating === 'all') {
            return reviews; 
        }
        return reviews.filter(review => review.star_rating == rating); // Filter by specific rating
    }

    // Function to display filtered reviews
    function displayFilteredReviews(filteredReviews, product) {
        const reviewsContainer = document.getElementById('reviews');
        reviewsContainer.innerHTML = ''; 
        filteredReviews.forEach(review => {
            const reviewItem = createReviewItem(review, product); // Create filtered review item
            reviewsContainer.appendChild(reviewItem); // Append to the container
        });
    }

    // Handle review form submission
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault(); 

        const userName = document.getElementById('user-name').value;
        const starRating = parseInt(document.getElementById('star-rating').value);
        const reviewText = document.getElementById('review-text').value;

        // Validate if all fields are filled
        if (!userName || !starRating || !reviewText) {
            alert('Please fill in all fields.');
            return;
        }

        // Create a new review object
        const newReview = {
            user_name: userName,
            star_rating: starRating,
            review_text: reviewText,
            review_date: new Date().toISOString().split('T')[0], 
            likes: 0 
        };

        // Add the new review to the selected product's review array
        selectedProduct.reviews.push(newReview);

        // Re-display the updated product details and reviews
        displayProductDetails(selectedProduct);

        // Recalculate and update the review summary and star breakdown
        displayReviewSummary(selectedProduct.reviews);

        // Reset the review form
        reviewForm.reset();
    });
});

