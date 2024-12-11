# Product Review Page

## Project Overview
The Product Review Page designed to allow users to interact with product details and submit reviews. The page is structured to give users an overview of the product, display existing reviews, and submit their own reviews. It supports filtering reviews based on star ratings and includes a dynamic review submission feature.

## Features
- **Product Overview Section**  
  Displays key product information, including:
  - Product image
  - Product name
  - Product price
  - Product description

- **Review Summary Section**  
  Shows:
  - Average rating of the product
  - Breakdown of ratings (how many reviews are there for each star rating)

- **Review List Section**  
  Displays all the reviews submitted by users, including:
  - User name
  - Star rating
  - Review text
  - Date of the review
  
- **Add Review Form**  
  Provides a form for users to submit their own reviews, including:
  - Name
  - Star rating
  - Review text
  
- **Review Filtering**  
  Allows users to filter reviews by star rating from star 1 to star 5.

- **Dynamic Review Addition**  
  New reviews are dynamically added to the review list when submitted by users.

- **Validation on Form Submission**  
  The form checks for required fields. 

- **Like Button**
  Users can like reviews, and a counter will display how many people found the review useful.

- **Responsive Design**  
  - The page layout adapts to different screen sizes using CSS, ensuring the page is mobile-friendly and looks good on all devices (desktop, tablet, mobile).
  - **Animations** for actions like submitting reviews.

- **Accessibility**  
  The project uses semantic HTML and ARIA attributes to make sure the page is accessible to screen readers and users with disabilities.

## Tech Stack
- **HTML**: Used for the page structure.
- **CSS**: For styling the page and for responsiveness.
- **JavaScript**: To handle dynamic behaviors like adding new reviews and filtering reviews.
- **External API** for user data: [https://mocki.io/v1/0d96b1ad-1c02-423d-bad8-fdde2f837719](https://mocki.io/v1/0d96b1ad-1c02-423d-bad8-fdde2f837719)


## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TejalPisal/product-review-page-task.git
   cd product-review-page-task

