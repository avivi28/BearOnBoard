# BearOnBoard 🐻🐾 

Purpose:
- As a map-oriented social Website 🗺
- Follow the paws(posts) you saved before on map 🐾 
- Hunt the closest bears(spots) with your friends 👩🏻‍🌾
- Share the bear's location(spots' location) ⚠️

UML diagram:

![bearonboardUML drawio (1)](https://user-images.githubusercontent.com/95410966/167293150-71abd1c2-3f9c-4b31-a25a-65b15f2a21f2.svg)

Features checklist: **(compulsory)**
- [X] Member System
(register, sign in, log out, log in with Gmail)
- [X] Save posts on Map 
(show all markers, return your current location)
- [X] Create Friendship system 
(Search existing friends, Send friends request(cannot send request to yourself OR added friend), Accept/Reject friends request, Delete friends)
- [X] Get Friends' Posts
- [ ] Interacte with fds (comment + like) on friends' saved posts
``` diff
! MUST finish within first two weeks
```

Extra Optimization: **(optional)**
- [ ] Redis
- [ ] Text-only Chatroom/ socket.io
(Real-time chat, friends' request)
- [ ] Get the shortest distance 
- [ ] Share live location
- [ ] Search Engine
``` diff
! FINISH these after compulsory parts done
```

Tiny stuffs:
- [ ] frontend & backend validation
- [ ] better loading effects (e.g. loading page & RWD)
- [X] upload photos to S3 & pull from CDN
- [ ] set static server with Nginx
- [ ] update UML diagram
- [ ] finish swagger API page
- [ ] debug & review
``` diff
! FINISH these in last week 
```

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
- Cloud Service
  - `S3`
  - `EC2`
  - `CloudFront`
- Other tools
  - `Nginx`
  - `Docker`
  - `Figma`
  - `Git`
  - `Google Maps API`
