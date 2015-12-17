/*!
 * mars
 * Copyright(c) 2015 huangbinglong
 * MIT Licensed
 */

angular.module("ui.neptune.service.util", [])
    .factory("PinyinUtil",function() {
        function upperFirstWord(words,split) {
            if (!words) {
                return words;
            }
            var wArr = words.split(split);
            for (var i = 0;i<wArr.length;i++) {
                var one = wArr[i];
                if (one) {
                    wArr[i] = one.substring(0,1).toUpperCase() + one.substring(1,one.length);
                }
            }
            return wArr.join(split);

        }
        var factory = {};
        factory.chinese2Pinyin = function(chinese,isUpperFirstWord) {
            var split = " ";
            if (chinese && Pinyin) {
                var pinyin = Pinyin.t(chinese,split);
                if (isUpperFirstWord) {
                    pinyin = upperFirstWord(pinyin,split);
                }
                return pinyin?pinyin.replace(/\s+/g,""):chinese;
            }
            return chinese;
        };

        factory.chinese2PinyinWithSplit = function(chinese,split,isUpperFirstWord) {
            split = split || " ";
            if (chinese && Pinyin) {
                var pinyin = Pinyin.t(chinese,split);
                if (isUpperFirstWord) {
                    pinyin = upperFirstWord(pinyin,split);
                }
                return pinyin?pinyin:chinese;
            }
            return chinese;
        };
        return factory;
    });
