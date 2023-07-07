const express=require('express');
const message_route=express();

const bodyParser=require('body-parser');
message_route.use(bodyParser.json());
message_route.use(bodyParser.urlencoded({extended:true}));

const messageController=require('../controllers/messageController');


// message route
message_route.post('/add-message',messageController.addMessage);
message_route.post('/send-members',messageController.sendMembers);

message_route.get('/send-message',messageController.messageSend);
message_route.get('/send-messageLater',messageController.messageSendLater);
message_route.get('/send-allMessage',messageController.sendAll);
message_route.get('/schedule-allMessage',messageController.scheduleAll);
message_route.get('/delete-message',messageController.deletemessage);
message_route.get('/send-list',messageController.sendList);
message_route.get('/edit-message',messageController.editMessage);
message_route.put('/edit-message/:id',messageController.updateMessage);
message_route.put('/updateMessageArchive/:id',messageController.updateMessageArchiveUnarchive);

message_route.get('/export-message',messageController.exportMessage);
message_route.put('/undo-message/:id',messageController.undoMessage);
message_route.put('/message-delete/:id',messageController.softDeleteMessage);

module.exports=message_route;