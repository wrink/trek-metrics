## To Run

In the project directory, you can run:

### `docker-compose down -v && docker-compose up --build`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Notes
You may have noticed this application contains unnecessary containerization in the form of docker and docker-compose. The former is purely to ensure that this application will run the same on any computer regardless of OS or installed dependencies. As for docker-compose, this is included for the sake of expansibility. While this particular project is unlikely to be expanded, a production-ready project would move the react files and `Dockerfile` to a `/react` repository. Other microservices such as an api or database would be added in separated folders and included in the `docker-compose.yml`
