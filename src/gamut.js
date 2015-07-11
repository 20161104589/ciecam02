var merge = require("mout/object/merge"),
    {abs} = Math;

function Gamut (xyz, cam) {
	function contains (CAM) {
		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    isInside = (RGB[0] >= 0 && RGB[0] <= 1 && RGB[1] >= 0 && RGB[1] <= 1 && RGB[2] >= 0 && RGB[2] <= 1);
		return [isInside, RGB];
	}

	function limit (inCam, outCam, cor="C", prec=1e-3) {
		var bot = inCam[cor],
		    top = outCam[cor];
		while (abs(top-bot) > prec) {
			var mid = (bot + top) / 2,
			    [isInside,] = contains(merge(inCam, {[cor]: mid}));
			if (isInside) {
				bot = mid;
			} else {
				top = mid;
			}
		}
		return merge(inCam, {[cor]: bot});
	}

	return {
		contains: contains,
		limit: limit
	};
}

module.exports = Gamut;
