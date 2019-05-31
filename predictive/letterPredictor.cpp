#include <iostream>
#include <node.h>
#include <fstream>
// #include <algorithm>
#include <string>
#include <vector>

#define delimiter "\n"
#define delimiter_length 1
#define number_of_letters 26
#define letter_start 97

namespace letterPredictorModule {
	using namespace std;

	using v8::FunctionCallbackInfo;
	using v8::Context;
	using v8::Isolate;
	using v8::Local;
	using v8::Number;
	using v8::Value;
	using v8::Array;
	using v8::Object;
	using v8::String;

	vector<string> words;

	vector<string> getWordList() {
		vector<string> results;

		string line;
		ifstream myfile ("./data/words.txt");
		
		if (myfile.is_open()) {
			
			while (getline (myfile,line)) {
				results.push_back(line);
			}

			myfile.close();
		}

		return results;
	}

	vector<string> splitText(string text) {
		vector<string> results;

		size_t pos = 0;
		std::string token;
		
		while ((pos = text.find(delimiter)) != std::string::npos) {
			token = text.substr(0, pos);
			results.push_back(token);
			
			text.erase(0, pos + delimiter_length);
		}

		results.push_back(text);
		
		return results;
	}

	vector<string> getWords() {
		return getWordList();
	}

	struct letterScore {
		char letter;
		uint score;

	};

	inline bool compare(letterScore a, letterScore b) {
		return a.score > b.score;
	}

	vector<char> getWordOrder(string word, vector<string> words) {
		vector<letterScore> scores(number_of_letters);

		for (int i = 0; i < number_of_letters; i++) {
			letterScore score = {
				(char) (i + letter_start),
				0,
			};

			scores[i] = score;
		}

		int length = word.length();

		for (int i = 0; ((unsigned long) i) < words.size(); i++) {
			if (words[i].length() > ((unsigned long) length) && word == words[i].substr(0, length)) {
				cout << words[i] << "\n";
				scores[words[i][length] - letter_start].score += 1;
			}
		}

		// sort(scores.begin(), scores.end(), compare); 

		vector<char> results;

		for (int i = 0; i < number_of_letters; i++) {
			letterScore current = scores[i];
			
			if (current.score != 0) {
				results.push_back(current.letter);
			}
		}

		return results;
	}

	void predictNextLetters(const FunctionCallbackInfo<Value>& args) {
		Isolate* isolate = args.GetIsolate();

		String::Utf8Value str(isolate, args[0]);
		string value(*str);


		vector<char> results = getWordOrder(value, words);

		Local<Array> formatted = Array::New(isolate);
		
		for (int i = 0; ((unsigned long) i) < results.size(); i++ ) {
			formatted->Set(i, String::NewFromUtf8(isolate, string(1, results[i]).c_str()));
		}

		args.GetReturnValue().Set(formatted);
	}

	void Initialize(Local<Object> exports) {
		vector<string> possibleWords = getWords();

		for (int i = 0; ((unsigned long) i) < possibleWords.size(); i++) {
			words.push_back(possibleWords[i]);
		}

		NODE_SET_METHOD(exports, "nextLetters", predictNextLetters);
	}

	NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
}