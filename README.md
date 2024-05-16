# ProjectGem

This project is a web application utilizing Google's Gemini API for chat interactions. Chat session history is maintained, allowing the model to contextualize responses based on previous interactions.

Users can choose between 3 versions of Gemini:
1. Gemini 1.0 Pro
2. Gemini 1.5 Flash `(default)`
3. Gemini 1.5 Pro

## Running the Application

**I have no plans to deploy this on a server**. If anyone wants to replicate it, follow these steps:

1. Obtain the API key from Google.
2. Create a `.env` file in the project root directory.
3. Add the API key to the `.env` file with the name `GEMINI_API_KEY`.

### Running with npm
_Install dependencies_
```bash
npm install
```
_Start the application_
```bash
npm start
```

### Running with Docker
_Build the Docker image_
```bash
docker build -t projectgem .
```
_Run the Docker container_
```bash
docker run -d -p 3000:3000 projectgem
```

### **Contributions are welcome!**

## License

This project is licensed under the [MIT License](LICENSE).
