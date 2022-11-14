# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json yarn.lock ./
COPY . /usr/src/app
# might use --frozen-lockfile on prod
RUN yarn --silent --pure-lockfile


EXPOSE 8080

# start app
CMD ["yarn", "start"]