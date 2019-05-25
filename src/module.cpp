#include <node.h>
#include <uv.h>

#include "main.cpp"

namespace blinkDetectorModule {
	using v8::Context;
	using v8::Function;
	using v8::FunctionCallbackInfo;
	using v8::Isolate;
	using v8::Local;
	using v8::Persistent;
	using v8::Null;
	using v8::NumberObject;
	using v8::Object;
	using v8::Value;

	atomic<bool> stopped;

	uv_async_t asyncCallback;
	uv_loop_t *loop;
	uv_work_t request;

	mutex callbackLock;	
	Persistent<Function> callback;

	void runCallback(uv_async_t *handle) {

		callbackLock.lock();

		Isolate *isolate = Isolate::GetCurrent();
    	v8::HandleScope handleScope(isolate);

		const unsigned numberOfArgs = 2;

		BlinkResult result = *((BlinkResult *) handle->data);
		
		Local<Value> argv[numberOfArgs] = {
			NumberObject::New(isolate, result.leftEyeRatio), NumberObject::New(isolate, result.rightEyeRatio)
		};

		Local<Function>::New(isolate, callback)->Call(isolate->GetCurrentContext(), Null(isolate), numberOfArgs, argv);

		callbackLock.unlock();
	}

	void callbackWrapper(BlinkResult result) {

		asyncCallback.data = (void *) &result;
		uv_async_send(&asyncCallback);

	}

	void processWrapper(uv_work_t *req) {
		processLoop(callbackWrapper, &stopped);
	}

	void after(uv_work_t *req, int status) {
		callbackLock.lock();
    	
    	uv_close((uv_handle_t*) &asyncCallback, NULL);

    	callbackLock.unlock();
    }

	void startProcessing(const FunctionCallbackInfo<Value>& args) {
		if (!stopped) {
			return;
		}

		Isolate* isolate = args.GetIsolate();
		request = uv_work_t();

		callbackLock.lock();

		stopped = false;

    	callback.Reset(isolate, Local<Function>::Cast(args[0]));

		loop = uv_default_loop();
		
		uv_async_init(loop, &asyncCallback, runCallback);
		uv_queue_work(loop, &request, processWrapper, after);

		callbackLock.unlock();
	}

	void stopProcessing(const FunctionCallbackInfo<Value>& args) {
		// stopped = true;

		// computerVisionThread.join();
	}

	void Initialize(Local<Object> exports) {
		stopped = true;

		NODE_SET_METHOD(exports, "startProcessing", startProcessing);
		// NODE_SET_METHOD(module, "stopProcessing", Method);
	}

	NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
}