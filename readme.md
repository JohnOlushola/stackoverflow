# Stackoverflow
A simple clone of Stackoverflow.

## Documentation
A Postman documentation for the this project can be found [here](https://documenter.getpostman.com/view/4498250/SWT8hKcG)


## Authentication
Users are authenticated using JWT.

### Protected routes/actions
Stackoverflow requires users to be authenticated before they can perform some action. This application mirrors that and some routes/actions are protected which means user has to be authenticated to perform action. 
Protected actions:
- Ask Question
- Answer Question
- Upvote or downvote question
- Subscribe
- Delete question
- Delete answer

## Bonus: Subsribe
### Default
When a question is created, by default the question author is subscribed to question.

### Route
For a user to user to subscibe to a question a PUT request with the question's id as a parameter is made to 
```/question/:id/subscribe```

### Logic
The question model has an array of subscribed users which is updated everytime a new user subscibes. 
The user model also has an array of questions subscribed to, which is updated when user subscribes to a question and when the question is answered. 

When a question is answered, all users subscribed contained in question's subscribed array are updated to notify subscribed user that the question has been answered.


## Tests
```npm test```