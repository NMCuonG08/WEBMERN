import { Router } from 'express';
import Quizze from '../models/Quizze.js';
import { upload, cloudinary } from '../config/cloudinary.js';
import {getIdByName} from './categoryRoute.js'
import {uploadImage} from '../services/mediaService.js'


const router = Router();

router.get('/getByUserId', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const quizze = await Quizze.find({ createdBy: userId }); 
    res.json(quizze);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/getAll', async (req, res) => {
  try {
    const { userId } = req.query;
    const quizze = await Quizze.find({ 
      createdBy: { $ne: userId } 
    }); 
   
    res.json(quizze);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// router.post("/create", async (req, res) => {
//   const { title, description, createdBy } = req.body;
//   const quizze = new Quizze({
//     title,
//     description,
//     createdBy,
//   });
//   try {
//     const newQuizze = await quizze.save();
//     res.status(201).json(newQuizze);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


router.get("/getByCategory", async (req, res) => {
  try {

    const category = req.query.category;
    console.log(category);
    const quizze = await Quizze.find({ category: category });
    res.json(quizze);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }

});



router.post("/create", async (req, res) => {
  const { title, description, category, level, createdBy, imageUrl } = req.body;


  const categoryId = await getIdByName(category) 
  
  try {
    const quizze = new Quizze({
      title:title,
      description:description,
      category:categoryId,
      image: imageUrl || '', 
      level:level,
      createdBy:createdBy,
    });
    
    const newQuizze = await quizze.save();
    res.status(201).json(newQuizze);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete-image/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return res.json({ message: 'Image deleted successfully' });
    } else {
      return res.status(400).json({ message: 'Failed to delete image' });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: error.message });
  }
});


router.put("/update/:id", async (req, res) => {
  const { title, description, category, level, image } = req.body;
;
  const { id } = req.params;
  try {
    const quizze = await Quizze.findById(id); 
    if (title) quizze.title = title;
    if (description) quizze.description = description;
    if (category) quizze.category = category;
    if (level) quizze.level = level;
    if (image) quizze.image = image;
    quizze.updatedAt = new Date();
    const updatedQuizze = await quizze.save();
    res.json(updatedQuizze);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




export default router;