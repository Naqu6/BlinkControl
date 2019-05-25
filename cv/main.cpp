#ifndef _FACE_DETECTOR_MAIN_
#define _FACE_DETECTOR_MAIN_

#include <chrono>
#include <thread>
#include <opencv2/opencv.hpp>

#include "faceDetector.cpp"
#include "blinkDetector.cpp"
 
using namespace std;
using namespace cv;

mutex faceDetectionLock;
atomic<bool> faceFindingComplete;

void getFaceBounds(FaceDetector *detector, Mat image, Rect *bounds) {
	Rect result = detector->getFaceBounds(image);

	faceDetectionLock.lock();

	*bounds = result;

	faceDetectionLock.unlock();

	faceFindingComplete = true;
}

void printTimeElapsed(std::chrono::time_point<std::chrono::system_clock> startTime, string id) {
	cout << "Time point at: " << id << " Time:" << ((chrono::duration<double>) (chrono::system_clock::now() - startTime)).count() << "s\n";
}
 
void processLoop(void sendData(BlinkResult result), atomic<bool> *shouldStop) {
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

	auto cameraStartTime = chrono::system_clock::now();

	thread faceDetectionThread;

	faceFindingComplete = true;
	 
	// Read a frame
	while(cam.read(frame)) {
		if (*shouldStop) {
			break;
		}

		printTimeElapsed(cameraStartTime, "Camera Processing Time: ");

		auto start = chrono::system_clock::now();

		faceDetectionLock.lock();

		Rect currentBounds = *faceBounds;

		faceDetectionLock.unlock();

		if (currentBounds.width != 0) {
			result = blinkDetector.getBlinkResult(frame, currentBounds);

			if (result.success) {
				sendData(result);
			}

			rectangle(frame, currentBounds, Scalar(255, 200, 0));
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
		printTimeElapsed(start, "Face Processing Time: ");
		
		// Display results 
		// Exit loop if ESC is pressed

		cameraStartTime = chrono::system_clock::now();
	}

	delete faceBounds;
	faceDetectionThread.join();
}

#endif // _FACE_DETECTOR_MAIN_