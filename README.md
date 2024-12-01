   4 docker images
   5 docker run -dp 8000:80 --name react-example  react-example:latest
   6 docker login
   7 docker buildx build --platform linux/amd64,linux/arm64 -t react-example:latest .
   8 docker buildx create --use...
   9 docker buildx build --platform linux/amd64,linux/arm64 -t react-example:latest .
  10 docker push nponnamb/react-example:latest
  11 docker buildx build --platform linux/amd64,linux/arm64 -t nponnamb/react-example:latest .
  12 docker push nponnamb/react-example:latest
  13 docker images
  14 docker image build -t nponnamb/react-example:latest .
  15 docker push nponnamb/react-example:latest
  17 docker ps
  18 docker stop 48b590bfa75d