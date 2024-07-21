## About The Project

This project is a RESTful API designed for image processing, offering functionalities such as image cropping, resizing, and blurring. It adheres to the MVC design pattern to ensure a clean 
separation of concerns, facilitating ease of maintenance, debugging, and testing. 
The project includes a comprehensive unit testing strategy using the Jest framework, with the SuperTest module employed to conduct unit tests on the HTTP server.
To support continuous integration and deployment I implemented a [GitHub Actions workflow](https://github.com/AhmadAlBarasy/image-processing-api/blob/main/.github/workflows/run-test.yml)
to automatically run the test suite whenever new changes are pushed or merged into the main branch.

### Built With
* Node.js for the Runtime enviroment
* Typescript for the language.
* Express.js as the backend framework.
* Jest as the testing framework.

### API Endpoints
An important note to mention: you should 2 attributes in the JSON body of the requests of the following operations for them to work correctly \[fileName, newName] these names should also be a valid file names.
* `/api` GET request to list all of the files in the public directory.
* `/api/upload` POST request to upload a file to the server (Note: only images of type PNG, JPEG are supported at the moment, you should use form-data if you use postman and use a file attribute name 'image' to successfully
  upload an image).
* `/api/delete?fileName=example.png` DELETE request to delete an image that exists on the server.
* `/api/resize` POST request used to resize an image that exists on the server (You should use JSON body and include valid resize dimensions \[width, height], you also need to include a boolean value called 'respectAspectRatio' that
indicates whether you should respect the aspect ratio while resizing or not).
* `/api/crop` POST request used to crop an image that exists on the server (You should use JSON body and include valid crop dimensions \[left, top, width, height].
* `/api/blur` POST request used to blur an image that exists on the server (You should use JSON body and include valid blur sigma value.
  


### Prerequisites

To run this API on your local machine, you first have to make sure that node is installed. head over to [Node.js website](https://nodejs.org/en) to install node.

### Installation and Usage

1. Clone the repo
   ```sh
   git clone https://github.com/AhmadAlBarasy/image-processing-api.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run the server using the dev script
    ```sh
   npm run dev
   ```
5. To run tests, use the test script
   ```
   npm run test
   ```
   
## Contact

LinkedIn - [Ahmad Albarasy](linkedin.com/in/ahmad-albarasy)
