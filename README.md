<h1 align="center"> BearOnBoard 🐻🐾</h1>

Purpose:
- As a map-oriented social Website 🗺
- Follow the paws(posts) you saved before on map 🐾 
- Hunt the closest bears(spots) with your friends 👩🏻‍🌾
- Share the bear's location(spots' location) ⚠️

### Database Schema:
<p align="center">
  <img src="https://user-images.githubusercontent.com/95410966/173153753-41e652cd-b71c-4afa-85e1-a3703a7c89bc.png">
</p>

### Architecture Diagram:
<p align="center">
  <img src="https://user-images.githubusercontent.com/95410966/172022290-3e20de09-b441-4f64-9b6c-70977274eb69.png">
</p>

Features checklist: **(compulsory)**
- [X] Create member System

(Register, Sign in, Log out, Log in with Gmail)
- [X] Save posts on Map 

(Show all posts on Map, Show posts' details when clicked, Add new posts, Delete posts, Locate your current location)
- [X] Create Friendship system 


(Search existing friends, Send friends request(cannot send request to yourself OR added friend), Accept/Reject friends request, Show pending lists AND friend lists, Delete friends)
- [X] Get Friends' Posts


(Show all friends' posts on map, Show posts' details when clicked)
- [X] Interacte with fds (comment + like) on friends' saved posts


(Like OR unlike function, Add comments function)

``` diff
! MUST finish within first two weeks
```

Extra Optimization: **(optional)**
- [X] Redis (Posts caching & History message caching)
- [X] Text-only Chatroom (join separated rooms, real-time text sending, show typing status, show history chat with pagination)
- [X] Show online/offline user status
- [X] User Guide (software: `userguiding`)
- [X] Handle Error when no location access
- [X] Message Queue (send meesage in chatroom)
- [ ] CICD
- [ ] Get the shortest distance 
- [ ] Share live location
- [ ] Search Engine(API) ✓ (trie search OR elastic search)
``` diff
! FINISH these after compulsory parts done
```

Tiny stuffs:
- [ ] frontend & backend validation
- [ ] RWD
- [X] better loading effects
- [X] upload photos to S3 & pull from CDN
- [ ] update UML diagram
- [X] update Architecture Diagram
- [X] finish swagger API page
- [ ] debug & review
``` diff
! FINISH these in last week 
```

Suggestions from TONY:
- [ ] improve db query efficiency (add index!)
- [X] handle overload when user click `likes` (message queue)
- [X] upload all images to S3
- [X] upload docker image to ECR(elastic container registry)


Techniques used:
- Member system
  - `JWT`
  - `Bcrypt`
  - `Google Ouath2` (`passportJS`)
- Database
  - `MongoDB` (`Mongoose`)
- Web server
  - `NodeJS`/ `ExpressJS`
  - `EJS`
- Cache
  - `Redis`
  - `Message Queue` (`RabbitMQ`)
- Cloud Service
  - `S3`
  - `EC2`
  - `CloudFront`
- Other tools
  - `Nginx`
  - `Docker`
  - `Docker-Compose`
  - `Figma`
  - `Git`
  - `Google Maps API`
  - `socket.io`

### API Doc (Swagger)
https://app.swaggerhub.com/apis-docs/Honeypaw/Register/1.0.0
