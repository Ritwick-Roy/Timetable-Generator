FROM gcc:12.2.0-bullseye
WORKDIR /server
COPY . /server/
EXPOSE 8000
RUN g++ -o server httpserver.cpp
CMD ["./server"]