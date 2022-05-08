# BearOnBoard 🐻🐾 

Purpose:
- Social  Website
- Hunt the closest bear with your friends
- Share the bear's location to your friends

UML:

![bearonboardUML drawio (1)](https://user-images.githubusercontent.com/95410966/167293150-71abd1c2-3f9c-4b31-a25a-65b15f2a21f2.svg)

Processes Checklist: ==(compulsory)==
- [X] Member System
- [ ] Post on Map
- [ ] Add Friends 
- [ ] Get Friends' Posts
- [ ] Interacte with fds (comment + like)
- [ ] Get the shortest distance 
- [ ] Share live location
- [ ] Search Engine

Extra Optimization: ==(optional)==
- [ ] Redis
- [ ] Text-only Chatroom/ web sockets

Tiny stuffs:
- [ ] frontend & backend validation
- [ ] better loading effects (e.g. loading page)
- [ ] upload photos to S3 & pull from CDN

Techniques used:
- Member system
  - JWT
  - Bcrypt
  - Google Ouath2 (passportJS)
- Database
  - MongoDB
- Web server
  - NodeJS/ ExpressJS
  - EJS
- Other tools
  - Nginx
  - Docker
