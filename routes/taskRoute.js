const express=require('express');
const task_route=express();
const session=require('express-session');

const config=require('../config/config');

task_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
task_route.use(bodyParser.json());
task_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

task_route.use(express.static('public'));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/uploads/invoiceImages'),function(error,success){
            if(error) throw error
        });
    },

    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name,function(error1,success1){
            if(error1) throw error1
        })
    }
});

const upload=multer({storage:storage});

const taskManagementController=require('../controllers/task_managementController')
const jwtHelper=require('../config/jwtHelper')

// task management
task_route.post('/add-source', taskManagementController.contactSource);
task_route.get('/source-list', taskManagementController.sourceList);
task_route.post('/add-sales', taskManagementController.salesPhase);
task_route.get('/sales-list', taskManagementController.salesList);
task_route.get('/edit-sales', taskManagementController.editSales);
task_route.get('/all-task',taskManagementController.allTask);
task_route.put('/edit-sales/:id',taskManagementController.updateSales);
task_route.post('/add-action',taskManagementController.addAction);
task_route.get('/delete-action',taskManagementController.deleteAction);
task_route.get('/action-list', taskManagementController.actionList);
task_route.put('/edit-action/:id',taskManagementController.updateAction);
task_route.post('/add-task', taskManagementController.addTask);
task_route.get('/task-list', taskManagementController.taskList);
task_route.get('/edit-task',taskManagementController.editTask);
task_route.put('/edit-task/:id',taskManagementController.updateTask);
task_route.get('/delete-task',taskManagementController.deleteTask);
task_route.post('/next-action',taskManagementController.addnextAction);
task_route.put('/edit-taskInfo/:id',taskManagementController.editTaskInfo);
task_route.put('/edit-taskIndivisual/:id',taskManagementController.updateIndivisual);
task_route.put('/edit-note/:id',taskManagementController.updateNote);

task_route.get('/get-task-history-by-id',taskManagementController.getTaskHistoryByID);

task_route.get('/exist-taskaction',taskManagementController.actionExist);

task_route.get('/export-task',taskManagementController.exportTask);
task_route.put('/updateTaskArchive/:id',taskManagementController.updateTaskArchiveUnarchive);

task_route.post('/send-Invoice',upload.single('invoice_file'),taskManagementController.sendInvoiceData);




module.exports=task_route;