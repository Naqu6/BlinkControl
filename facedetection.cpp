#include <chrono>
#include <thread>
#include <opencv2/opencv.hpp>
#include <opencv2/face.hpp>

#include "faceDetector.cpp"
#include "blinkDetector.cpp"
 
using namespace std;
using namespace cv;
using namespace cv::face;

mutex faceDetectionLock;
atomic<bool> faceFindingComplete;

void getFaceBounds(FaceDetector *detector, Mat image, Rect *bounds) {
	Rect result = detector->getFaceBounds(image);

	faceDetectionLock.lock();

	*bounds = result;

	faceDetectionLock.unlock();

	faceFindingComplete = true;
}
 
int main(int argc,char** argv) {
	// Load Face and Blink Detectors
	FaceDetector faceDetector;
	EyeRatioDetector blinkDetector;

	// Set up webcam for video capture
	VideoCapture cam(0);
	 
	// Variable to store a video frame and its grayscale 
	Mat frame;

	// For face detection checking
	Rect *faceBounds = new Rect();

	BlinkResult result;

	result.success = false;

	auto startTime = chrono::system_clock::now();

	thread faceDetectionThread;

	faceFindingComplete = true;
	 
	// Read a frame
	while(cam.read(frame)) {		
		auto endTime = chrono::system_clock::now();

		chrono::duration<double> elapsed = endTime - startTime; 

		cout << "\nCam Time: " << elapsed.count() << "s\n";

		startTime = chrono::system_clock::now();

		faceDetectionLock.lock();

		Rect currentBounds = *faceBounds;

		faceDetectionLock.unlock();

		if (currentBounds.width != 0) {
			result = blinkDetector.getBlinkResult(frame, currentBounds);

			if (result.success) {
				cout << "**Result Success**\n";
				if (result.leftEyeRatio < .3 && result.rightEyeRatio < .3) {
					cout << "**Blinking**\n";
				}
			}
		}

		if (faceFindingComplete) {
			if (faceDetectionThread.joinable()) {
				faceDetectionThread.join();
			}

			faceFindingComplete = false;

			Mat grayscale;

			cvtColor(frame, grayscale, COLOR_BGR2GRAY);

			faceDetectionThread = thread(getFaceBounds, &faceDetector, grayscale, faceBounds);
		}

		// Display results 
		// imshow("Facial Landmark Detection", frame);
		// Exit loop if ESC is pressed
		if (waitKey(1) == 27) break;
		 
		endTime = chrono::system_clock::now();

		elapsed = endTime - startTime; 

		startTime = chrono::system_clock::now();

		cout << "\nProcess Time: " << elapsed.count() << "s\n";

	}

	delete faceBounds;
	faceDetectionThread.join();

	return 0;
}