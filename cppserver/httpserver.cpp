#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <netdb.h> 
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <ctype.h>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include "colorGraph.cpp"
using namespace std;
#define QUEUE_LEN 10
#define PORT 8000

void trim (char *s)
{
    int i;
    while (isspace (*s)) s++;   // skip left side white spaces
    for (i = strlen (s) - 1; (isspace (s[i])); i--) ;   // skip right side white spaces
    s[i + 1] = '\0';
}

void report(struct sockaddr_in *serverAddress)
{
    char hostBuffer[INET6_ADDRSTRLEN],serviceBuffer[NI_MAXSERV]; // defined in `<netdb.h>`
    socklen_t addr_len = sizeof(*serverAddress);
    int err = getnameinfo(
        (struct sockaddr *) serverAddress,
        addr_len,
        hostBuffer,
        sizeof(hostBuffer),
        serviceBuffer,
        sizeof(serviceBuffer),
        NI_NUMERICHOST
    );
    if (err != 0)
        cout<<"It's not working!!\n";
    cout<<"\n\n\tServer listening on http://"<<hostBuffer<<":"<<serviceBuffer<<"\n";
}

int main(void)
{
    int clientSocket,serverSocket,valread,i;
    string method,filename,httpHeader;

    if((serverSocket=socket(AF_INET,SOCK_STREAM,0))==0)
    {
        perror("In socket");
        exit(EXIT_FAILURE);
    }

    struct sockaddr_in serverAddress;
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(PORT);
    serverAddress.sin_addr.s_addr = inet_addr("127.0.0.1");

    if(bind(serverSocket,(struct sockaddr *) &serverAddress,sizeof(serverAddress))<0)
    {
        perror("In bind");
        exit(EXIT_FAILURE);
    }

    if (listen(serverSocket, QUEUE_LEN) < 0)
    {
        perror("In listen");
        exit(EXIT_FAILURE);
    }

    report(&serverAddress);

    while(1)
    {
        if((clientSocket = accept(serverSocket, NULL, NULL))<0)
        {
            perror("In accept");
            exit(EXIT_FAILURE);
        }

        char buffer[30000]={0};
        valread=read(clientSocket,buffer,30000);
        printf("%s\n",buffer);
        string buf(buffer);
        stringstream ss(buf);
        ss>>method;
        if(method=="POST")
        {
            i=buf.find("input");
            input="";
            for(i=i+8;buf[i]!='"';++i)
            input+=buf[i];
            solve();
            httpHeader="HTTP/1.1 200 OK\r\n\n{\n"+finalTT+"\n}";
            char str[httpHeader.size()];
            for(i=0;i<httpHeader.size();++i)
            str[i]=httpHeader[i];
            str[i]='\0';
            send(clientSocket, str, sizeof(str), 0);
        }
        close(clientSocket);
    }
    close(serverSocket);
    return 0;
}