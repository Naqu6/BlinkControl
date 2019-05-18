#include <opencv2/opencv.hpp>
#include <opencv2/face.hpp>
#include <chrono>
#include "drawLandmarks.cpp"
#include "blinkDetector.cpp"
 
using namespace std;
using namespace cv;
using namespace cv::face;

#define PIXEL_BUFFER 20

void addBuffer(Mat image, Rect rect) {
	rect.x = min(0, rect.x - PIXEL_BUFFER);
	rect.y = min(0, rect.y - PIXEL_BUFFER);

	rect.width = min(image.rows, rect.x + rect.width + PIXEL_BUFFER);
	rect.height = min(image.cols, rect.y + rect.height + PIXEL_BUFFER);
}
 
int main(int argc,char** argv) {
	// Load Face Detector
	CascadeClassifier faceDetector("haarcascade_frontalface_alt2.xml");

	// Load blink detector
	EyeRatioDetector blinkDetector;

	// Set up webcam for video capture
	VideoCapture cam(0);
	 
	// Variable to store a video frame and its grayscale 
	Mat frame;
	Rect faceBounds;
	BlinkResult result;

	int frameCounter = 0;

	auto startTime = chrono::system_clock::now();
	 
	// Read a frame
	while(cam.read(frame)) {
		auto endTime = chrono::system_clock::now();

		chrono::duration<double> elapsed = endTime - startTime; 

		cout << "\nCam Time: " << elapsed.count() << "s\n";

		startTime = chrono::system_clock::now();

		if (!faceBounds.width || frameCounter == 10) {
			frameCounter = 0;

			// Face detector take a grayscale image
			Mat gray;
			
			cvtColor(frame, gray, COLOR_BGR2GRAY);

			// Faces Results
			vector<Rect> faces;

			// Detect faces
			faceDetector.detectMultiScale(gray, faces);

			if (faces.size()) {
				faceBounds = faces[0];
			} else {
				continue;
			}
		}

		result = blinkDetector.getBlinkResult(frame, faceBounds);
		frameCounter++;

		if (result.success) {
			cout << "Result Sucessful\n";

			endTime = chrono::system_clock::now();

			elapsed = endTime - startTime; 

			startTime = chrono::system_clock::now();

			cout << "\nProcess Time: " << elapsed.count() << "s\n";
				if (result.leftEyeRatio < .3 && result.rightEyeRatio < .3) {
				cout << "**Blinking**\n";
			}
		} else {
			faceBounds.width = 0;
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

	return 0;
}