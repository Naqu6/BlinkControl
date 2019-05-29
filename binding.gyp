{
    "targets": [{
        "target_name": "blinkDetector",
        'include_dirs': [
            '.',
            '/user/local/lib',
        ],
        'cflags': [
            '-std=c++11',
        ],
        'cflags!': [ '-fno-exceptions'],
        'cflags_cc!': [ '-fno-exceptions'],
        'conditions': [
            ['OS=="mac"', {
                'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                    "GCC_ENABLE_CPP_RTTI": 'YES'
                }
            }]
        ],
        'link_settings': {
            'libraries': [
                '-I/usr/local/Cellar/opencv/3.4.1_5/include/opencv',
                 '-I/usr/local/Cellar/opencv/3.4.1_5/include',
                 '-L/usr/local/Cellar/opencv/3.4.1_5/lib',
                 '-lopencv_stitching',
                 '-lopencv_superres',
                 '-lopencv_videostab',
                 '-lopencv_aruco',
                 '-lopencv_bgsegm',
                 '-lopencv_bioinspired',
                 '-lopencv_ccalib',
                 '-lopencv_dnn_objdetect',
                 '-lopencv_dpm',
                 '-lopencv_face',
                 '-lopencv_photo',
                 '-lopencv_fuzzy',
                 '-lopencv_hfs',
                 '-lopencv_img_hash',
                 '-lopencv_line_descriptor',
                 '-lopencv_optflow',
                 '-lopencv_reg',
                 '-lopencv_rgbd',
                 '-lopencv_saliency',
                 '-lopencv_stereo',
                 '-lopencv_structured_light',
                 '-lopencv_phase_unwrapping',
                 '-lopencv_surface_matching',
                 '-lopencv_tracking',
                 '-lopencv_datasets',
                 '-lopencv_dnn',
                 '-lopencv_plot',
                 '-lopencv_xfeatures2d',
                 '-lopencv_shape',
                 '-lopencv_video',
                 '-lopencv_ml',
                 '-lopencv_ximgproc',
                 '-lopencv_calib3d',
                 '-lopencv_features2d',
                 '-lopencv_highgui',
                 '-lopencv_videoio',
                 '-lopencv_flann',
                 '-lopencv_xobjdetect',
                 '-lopencv_imgcodecs',
                 '-lopencv_objdetect',
                 '-lopencv_xphoto',
                 '-lopencv_imgproc',
                 '-lopencv_core'
            ]
        },
        "sources": [
            "./cv/module.cpp"
        ]
    }, {
        "target_name": "letterPredictor",
        'include_dirs': [
            '.',
            '/user/local/lib',
        ],
        'cflags': [
            '-std=c++11',
        ],
        'cflags!': [ '-fno-exceptions'],
        'cflags_cc!': [ '-fno-exceptions'],
        'conditions': [
            ['OS=="mac"', {
                'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                    "GCC_ENABLE_CPP_RTTI": 'YES'
                }
            }]
        ],
        "sources": [
            "./predictive/letterPredictor.cpp"
        ]
    }]
}
