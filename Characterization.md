#Characterization
This README is all about the characterization of the purplescouter project.

##The Purpose of the project
The purpose of the project is to create some application that will help the team to gather data about other teams in competition. The project should be comptible with android, iphone, windows/linux. It should be easy to access the team's stats and to set them fast during the match (super important, it will reduce mistakes).

##The project's features
+ Support cross platform.
+ Support users, give them an option to login (only admin can register).
+ Support some creation and modification of forms (with or without a gui).
+ Supoprt users sending some game data.
+ Support two different stats view, the first which is to see 6 teams at each time (for game purposes), the second is to view stats about only team (for alliance selection).

#####Could be nice but will be done only if the time will be enough.
Be friendly to the user, accept low network traffic (sometimes in compotitions the network traffic is super slow). maybe some caching will be nice.

Get game data from the "The Blue Alliance" in order to improve the user interface.

##The project's frameworks
+ The project will be a web project (the most easy way to be cross platform). 
+ The project's database will be mongodb.
+ The project's backend will be written in fastapi (python3)
+ The project's frontend will be written in ReactJS.
+ The project's backend will be REST api.
##MongoDB
The MongoDB will be setup locally (or on a remote server).

The MongoDB Server will have three collections: *Users*, *Games*, *Forms*.

####*Users* 
The *Users* collection stores all of the users informtion.

The User document format:

```
{
    "id": "id",
    "user_name": "name",
    "password": "password(md5)",
    "role": 0-1 (0 for regular and 1 for admin)
}
```

####*Games*
The *Games* collection stores all of the games stats.

The Game document format:
```
{
    "game_number": "game_number",
    "team_number": "team_number",
    "stats": [
        {
            "Defend": int,
            ...
        }
    ]
}
```

####*Forms*
In the *Forms* collection the form data will be stored.

```
{
    "form_name": "name",
    "form_data": [
        {
            "type": "check_box|radio_box|plain",
            "title": "title",
            "options": [
                "options1",
                "option2",
                ...
            ]
        }, 
        ...
    ]
}
```


##The API

| Operation   | Path        |  Parameters | Cookie    | Description | 
| ----------- | ----------- | -----------------|-----------|-------------|
| GET         | /           |        X         | JWT (optional)    | The root directory if the JWT cookie isn't set redirect to the login page will be returned.s|
| GET   | /login        |        X          |    X       |    The login page to the application       |
| POST | /login | Gets in the body request a user name and password(md5) in an object | X |  Login the user, sets a JWT |
| GET | /api/{team_number}/ | Path Paramter the team_number | X   | Returns all of the games the team played | 
| POST | /api/game | body request {team_number: "team_number", game_number: "game", stats: []} | JWT | Adds a new record of game of a team in the collection | 