<?php
/**
 * @name		CodeIgniter Advanced Images
 * @author		Jens Segers
 * @link		http://www.jenssegers.be
 * @license		MIT License Copyright (c) 2012 Jens Segers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class MY_Image_lib extends CI_Image_lib {

    var $user_width = 0;
    var $user_height = 0;
    var $user_x_axis = '';
    var $user_y_axis = '';

    /**
     * Initialize image preferences
     *
     * @access	public
     * @param	array
     * @return	bool
     */
    function initialize($props = array()) {
        // save user specified dimensions and axis positions before they are modified by the CI library
        if (isset($props["width"])) {
            $this->user_width = $props["width"];
        }
        if (isset($props["height"])) {
            $this->user_height = $props["height"];
        }
        if (isset($props["x_axis"])) {
            $this->user_x_axis = $props["x_axis"];
        }
        if (isset($props["y_axis"])) {
            $this->user_y_axis = $props["y_axis"];
        }

        return parent::initialize($props);
    }

    /**
     * Initialize image properties
     *
     * Resets values in case this class is used in a loop
     *
     * @access	public
     * @return	void
     */
    function clear() {
        $this->user_width = 0;
        $this->user_height = 0;
        $this->user_x_axis = '';
        $this->user_y_axis = '';

        return parent::clear();
    }

    /**
     * Smart resize and crop function
     *
     * @access	public
     * @return	bool
     */
    function fit() {
        log_message('error', 'fit user width: '.$this->user_width);
        log_message('error', 'fit user height: '.$this->user_height);
        log_message('error', 'fit orig width: '.$this->orig_width);
        log_message('error', 'fit orig height: '.$this->orig_height);

        // overwrite the dimensions with the original user specified dimensions
        $this->width = $this->user_width;
        $this->height = $this->user_height;

        // we will calculate the sizes ourselves
        $this->maintain_ratio = FALSE;

        // Check if we need to worry about fit
        if ($this->user_width == 0 || $this->user_height == 0) {
            return $this->maintainAspectRatio();
        }

        $dynamic_output = $this->dynamic_output;

        // if dynamic output is requested we will use a temporary file to work on
        $tempfile = FALSE;
        if($dynamic_output) {
            $temp = tmpfile();
            $tempfile = array_search('uri', @array_flip(stream_get_meta_data($temp)));
        }

        if(!$this->createOversizedResize($tempfile)) {
            // close (and remove) the temporary file
            if ($tempfile) {
                fclose($temp);
            }
            return FALSE;
        }

        // Update the image values for the resized image
        $this->orig_width = $this->width;
        $this->orig_height = $this->height;
        $this->width = $this->user_width;
        $this->height = $this->user_height;

        $this->updateAxisValues();

        // use the previous generated image for output
        $this->full_src_path = $this->full_dst_path;

        // reset dynamic output to initial value
        $this->dynamic_output = $dynamic_output;

        // cropping stage
        if (!$this->crop()) {
            return FALSE;
        }

        // close (and remove) the temporary file
        if ($tempfile) {
            fclose($temp);
        }

        return TRUE;
    }

    /**
     * Perform a resize where either height or width aren't
     * specified (i.e. maintain the ratio)
     *
     * @access  private
     * @return  void
     */
    function maintainAspectRatio() {
        if($this->user_width == 0) {
            $this->width = ceil(($this->user_height / $this->orig_height) * $this->orig_width);
        } else if($this->user_height == 0) {
            $this->height = ceil(($this->user_width / $this->orig_width) * $this->orig_height);
        }

        return $this->resize();
    }

    /**
     * Perform the resizing such that we have an enlarged image
     * to crop afterwards
     *
     * @access  private
     * @return  bool
     */
    function createOversizedResize($tempfile) {
        $ratiodWidth = ceil(($this->user_height / $this->orig_height) * $this->orig_width);
        $ratiodHeight = ceil(($this->user_width / $this->orig_width) * $this->orig_height);

        if ($this->master_dim == 'height') {
            $this->width = $this->user_width;
            $this->height = $ratiodHeight;
        } else {
            $this->width = $ratiodWidth;
            $this->height = $this->user_height;
        }

        // save dynamic output for last
        $this->dynamic_output = FALSE;
        if ($tempfile) {
            $this->full_dst_path = $tempfile;
        }

        // resize stage
        return $this->resize();
    }

    /**
     * Update the focal point for the crop
     *
     * @access  private
     * @return  void
     */
    function updateAxisValues() {
        // axis settings
        if (!is_numeric($this->user_x_axis)) {
            $this->x_axis = floor(($this->width - $this->user_width) / 2);
        } else {
            $this->x_axis = $this->user_x_axis;
        }

        if (!is_numeric($this->user_y_axis)) {
            $this->y_axis = floor(($this->height - $this->user_height) / 2);
        } else {
            $this->y_axis = $this->user_y_axis;
        }

        log_message('error', 'this->x_axis = '.$this->x_axis);
        log_message('error', 'this->y_axis = '.$this->y_axis);
    }

}
