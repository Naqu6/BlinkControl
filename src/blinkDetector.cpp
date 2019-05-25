#ifndef blinkDetector_H
#define blinkDetector_H 

#include <opencv2/opencv.hpp>
#include <opencv2/face.hpp>

using namespace std;
using namespace cv;
using namespace cv::face;

const int LEFT_START_INDEX = 36;
const int LEFT_END_INDEX = 41;

const int RIGHT_START_INDEX = 42;
const int RIGHT_END_INDEX = 47;

const int EYE_Y_PAIR_A_INDEX_LOW = 1;
const int EYE_Y_PAIR_A_INDEX_HIGH = 5;

const int EYE_Y_PAIR_B_INDEX_LOW = 2;
const int EYE_Y_PAIR_B_INDEX_HIGH = 4;

const int EYE_X_INDEX_LOW = 0;
const int EYE_X_INDEX_HIGH = 3;

struct BlinkResult
{
	bool success;
	double leftEyeRatio;
	double rightEyeRatio;
};

Mat resize(Mat image, Rect rect) {
	return Mat(image, rect);
}

class EyeRatioDetector {
	public:
		EyeRatioDetector() {
			// Create an instance of Facemark & Load landmark detector
			
			facemark = FacemarkLBF::create();
			facemark->loadModel("./data/lbfmodel.yaml");
		}

		BlinkResult getBlinkResult(Mat image, Rect bounds);

	private:
		Ptr<Facemark> facemark;

		vector<Point2f> getFaceLandmarks(Mat croppedImage);
		BlinkResult getBlinkStatus(vector<Point2f> landmarks);

		double getRatio(vector<Point2f> landmarks, const int start);
}; 

BlinkResult EyeRatioDetector::getBlinkResult(Mat image, Rect bounds) {
	Mat croppedImage = resize(image, bounds);

	cout << "Width: " << croppedImage.cols << " Height: " << croppedImage.rows << "\n";

	vector<Point2f> landmarks = getFaceLandmarks(croppedImage);

	BlinkResult result;

	if (landmarks.size()) {
		result = getBlinkStatus(landmarks);
		result.success = true;
	} else {
		result.success = false;
	}

	return result;
}

vector<Point2f> EyeRatioDetector::getFaceLandmarks(Mat croppedImage) {
	vector< vector<Point2f> > landmarks;

	vector<Rect> imageBounds(1, Rect(0, 0, croppedImage.rows, croppedImage.cols));

	bool success = facemark->fit(croppedImage, imageBounds, landmarks);

	if (success) {
		return landmarks[0];
	} else {
		return vector<Point2f>();
	}
}

BlinkResult EyeRatioDetector::getBlinkStatus(vector<Point2f> landmarks) {
	BlinkResult result;

	result.leftEyeRatio = getRatio(landmarks, LEFT_START_INDEX);
	result.rightEyeRatio = getRatio(landmarks, RIGHT_START_INDEX);

	result.success = true;
	
	return result;
}

double EyeRatioDetector::getRatio(vector<Point2f> landmarks, const int start) {
	int heightA = landmarks[start + EYE_Y_PAIR_A_INDEX_HIGH].y - landmarks[start + EYE_Y_PAIR_A_INDEX_LOW].y;
	int heightB = landmarks[start + EYE_Y_PAIR_B_INDEX_HIGH].y - landmarks[start + EYE_Y_PAIR_B_INDEX_LOW].y;
	int width = landmarks[start + EYE_X_INDEX_HIGH].x - landmarks[start + EYE_X_INDEX_LOW].x;

	return (heightA + heightB)/((double)(2*width));
}

#endif // blinkDetector_H