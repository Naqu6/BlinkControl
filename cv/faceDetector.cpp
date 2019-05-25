#ifndef _FACE_DETECTOR_
#define _FACE_DETECTOR_

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

struct position {
	int x;
	int y;
};

class FaceDetector {
	public:
		FaceDetector();

		Rect getFaceBounds(Mat image);
		void setTargetPosition(int x, int y);
	private:
		mutex positionLock;
		position targetPosition;
		CascadeClassifier faceDetector;
};

FaceDetector::FaceDetector() {
	faceDetector = CascadeClassifier("./data/haarcascade_frontalface_alt2.xml");
	targetPosition.x = -1;
	targetPosition.y = -1;
}

void FaceDetector::setTargetPosition(int x, int y) {
	positionLock.lock();
	
	targetPosition.x = x;
	targetPosition.y = y;

	positionLock.unlock();
}

Rect FaceDetector::getFaceBounds(Mat image) {
	vector<Rect> faces;
	
	faceDetector.detectMultiScale(image, faces);

	int numberOfFaces = faces.size();

	positionLock.lock();
	
	int targetX = targetPosition.x;
	int targetY = targetPosition.y;

	positionLock.unlock();

	for (int i = 0; i < numberOfFaces; i++) {
		if (targetX > faces[i].x && targetX < faces[i].x + faces[i].width && 
			targetY > faces[i].y && targetY < faces[i].y + faces[i].height) {
			return faces[i];
		}
	}

	if (numberOfFaces > 0) {
		return faces[0];
	}

	return Rect();
}

#endif