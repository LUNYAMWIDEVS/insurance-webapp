FROM node:16-alpine as builder


# Set working app directory
WORKDIR /usr/src/app

# Copy both package.json AND package-lock.json
# COPY package*.json ./
# RUN npm install

# Install production dependencies
# RUN  npm set progress false && npm install --only=production --loglevel warn
# RUN  npm audit fix


RUN apk update && apk add bash
# Install `serve` to run the application.
# RUN npm install -g serve

# RUN rm -rf ./build

# Build Application
# RUN npm run build
# Bundle app source

COPY . .


EXPOSE 8088
CMD ["/bin/bash", "-c", "/usr/src/app/docker/start_app.sh"]

# FROM nginx

# ENV NODE_ENV=production

# COPY --from=builder /usr/src/app/build /usr/share/nginx/html
# COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80

