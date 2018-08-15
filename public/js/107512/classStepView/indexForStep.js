var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoSubmission = function () {
    function PhotoSubmission() {
        _classCallCheck(this, PhotoSubmission);

        var inputs = document.querySelectorAll('.js-photo_submit-input');

        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', this.uploadImage);
        }
    }

    _createClass(PhotoSubmission, [{
        key: 'uploadImage',
        value: function uploadImage(e) {
            var fileInput = e.target;
            var uploadBtn = e.target.parentNode;
            var deleteBtn = e.target.parentNode.childNodes[7];

            var reader = new FileReader();

            reader.onload = function (e) {
                uploadBtn.setAttribute('style', 'background-image: url(\'' + e.target.result + '\');');
                uploadBtn.classList.add('photo_submit--image');
                fileInput.setAttribute('disabled', 'disabled');
            };

            reader.readAsDataURL(e.target.files[0]);

            deleteBtn.addEventListener('click', function () {
                uploadBtn.removeAttribute('style');
                uploadBtn.classList.remove('photo_submit--image');

                setTimeout(function () {
                    fileInput.removeAttribute('disabled', 'disabled');
                }, 200);
            });
        }
    }]);

    return PhotoSubmission;
}();

;

new PhotoSubmission();