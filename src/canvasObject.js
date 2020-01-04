/* container for an HTML canvas
 * use object.graphics for the graphics context
 */
class CanvasObject {
	constructor(canvasElementID) {
		this.id = canvasElementID;
		this.canvas = document.getElementById(canvasElementID);
		this.graphics = this.canvas.getContext("2d");

		this.resize = function (width, height) {
			this.canvas.width = width;
			this.canvas.height = height;
		}

		this.clear = function () {
			this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
}