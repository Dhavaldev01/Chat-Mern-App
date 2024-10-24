import Message from "../models/MessagesModel.js" ;
// import {mkdirSync, renameSync} from 'fs';
import { mkdir, rename } from 'fs/promises'; 
import path from 'path';

export const getMessages = async (req, res, next) => {
    try {
        
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2 ) {
            return res.status(400).send("Both UserId are Required .");
        }

        const messages = await Message.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1}
            ]
        }).sort({timestamp:1});

    return res.status(200).json({messages});

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};


// export const uploadFile = async (req, res, next) => {

//     try {
        
//        if(!req.file){
//         return res.status(400).send("File is required");
//        }

//        const date = Date.now();
//        let fileDir = `uploads/files/${date}`
//     //    let fileName = `${fileDir}/${req.file.originalname}`;

//     const fileName = path.join(fileDir, req.file.originalname);

//     //    mkdirSync(fileDir,{recursive:true});
//     await mkdir(fileDir, { recursive: true });
//     //    renameSync(req.file.path , fileName);
//     await rename(req.file.path, fileName);

//     const fileUrl = fileName; 

//     const newMessage = new Message({
//         sender: req.userId, 
//         recipient: req.body.recipientId, 
//         messageType: 'file',
//         fileUrl: fileUrl,
//         content:undefined,
//         timestamp: new Date(), 
//     });

//     console.log("New message data:", newMessage);
//     await newMessage.save();

//     return res.status(200).json({filePath:fileUrl});

//     } catch (error) {
//         console.error("Error in uploadFile:", error);
//         return res.status(500).send("Internal Server Error");
//     }
// };

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required");
        }

        const date = Date.now();
        const fileDir = path.join('uploads', 'files', `${date}`);
        const fileName = path.join(fileDir, req.file.originalname);

        await mkdir(fileDir, { recursive: true });
        await rename(req.file.path, fileName);

        const newMessage = new Message({
            sender: req.userId,
            recipient: req.body.recipientId,
            messageType: 'file',
            fileUrl: fileName,
            timestamp: new Date(),
        });

        await newMessage.save();
        console.log("Message saved successfully:", newMessage);

        return res.status(200).json({ filePath: fileName });
    } catch (error) {
        console.error("Error in uploadFile:", error);
        return res.status(500).send("Internal Server Error");
    }
};
