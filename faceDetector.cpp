#include <opencv2/opencv.hpp>

#define PIXEL_BUFFER 20

using namespace std;
using namespace cv;

void addBuffer(Mat image, Rect rect) {
	rect.x = min(0, rect.x - PIXEL_BUFFER);
	rect.y = min(0, rect.y - PIXEL_BUFFER);

	rect.width = min(image.rows, rect.x + rect.width + PIXEL_BUFFER);
	rect.height = min(image.cols, rect.y + rect.height + PIXEL_BUFFER);
}

class FaceDetector {
	public:
		FaceDetector();

		Rect getFaceBounds(Mat image);

	private: 
		CascadeClassifier faceDetector;
};

FaceDetector::FaceDetector() {
	faceDetector = CascadeClassifier("haarcascade_frontalface_alt2.xml");
}

Rect FaceDetector::getFaceBounds(Mat image) {
	vector<Rect> faces;
	
	faceDetector.detectMultiScale(image, faces);

	if (faces.size() > 0) {
		return faces[0];
	}

	return Rect();
}