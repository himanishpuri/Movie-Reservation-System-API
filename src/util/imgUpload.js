import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
	process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("posterImageURL");

const uploadToCloudinary = async (fileBuffer, fileOriginalName) => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: "moviePosters",
				public_id: Date.now().toString() + "_" + fileOriginalName,
			},
			(error, result) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
			},
		);

		uploadStream.end(fileBuffer);
	});
};

export const uploadImageMiddleware = (req, res, next) => {
	try {
		const imgUpload = async (error) => {
			if (error) {
				return next(error);
			}
			if (!req.file) {
				console.log("No file uploaded");
				return next();
			}

			const { buffer, originalname } = req.file;
			const result = await uploadToCloudinary(buffer, originalname);

			if (!result?.secure_url) {
				return next(new Error("Failed to upload image"));
			}

			req.body.posterImageURL = result.secure_url;
			next();
		};

		upload(req, res, imgUpload);
	} catch (error) {
		next(error);
	}
};
