FROM node:12.2.0-alpine as build 
WORKDIR /client
COPY . . 

RUN npm install --silent
# RUN npm install react-scripts@3.0.1 -g --silent 
RUN npm run build 

#prepare nginx
FROM nginx:alpine

COPY --from=build /client/build /usr/share/nginx/html



#fire up nginx
# EXPOSE 80 
CMD ["nginx","-g","daemon off;"]