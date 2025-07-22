# Safeway Coupon Clipper Extension <img align="left" width="40" src="./src/icon.png" />

Should work with any chromium-based browser. Untested on other browsers, but feel free to make a pull request to support them.
<br/>
<br/>

## Demo

[Demo video of the extension in action](https://github.com/user-attachments/assets/2944d4fb-95d7-4a9e-8943-75cf1c2cae3a)

<br/>

## Install

### Chrome Web Store

<img align="left" width="40" src="https://fonts.gstatic.com/s/i/productlogos/chrome_store/v7/192px.svg" />
<table>
 <td>
  <a href="https://chromewebstore.google.com/detail/safeway-coupon-clicker/cipnkngmomeggbifncmcmdmglgaaohdl">Install</a>
 </td>
</table>
<br/>

### Manual

1. Clone this repository or extract one of the release zips somewhere on your machine's filesystem where the extension code can remain.
1. Navigate to `chrome://extensions` in your browser
1. Ensure the "Developer mode" toggle is enabled (it's in the top right in my browser of choice):
 
   <img src="https://github.com/user-attachments/assets/db7c704a-e3fb-42f4-8021-4b55b85c7037" />
1. Click the "Load unpacked" option in the same page after devevloper mode is enabled:

   <img src="https://github.com/user-attachments/assets/3a0f8633-4702-4c2a-a8a8-74fcea58fa46" />
1. Select the `src` folder of this extension's code files that you placed in your local filesystem.
1. If loaded correctly, you should see this extension now listed among your other extensions:

   <img src="https://github.com/user-attachments/assets/d14b26fc-e9b7-4322-afe0-6c4f987784c1" />

<br/>


## Usage

The extension will only function on the webpage <https://www.safeway.com/foru/coupons-deals.html> (you will need a Safeway account to login).

1. Navigate to that page.
2. Activate this extension's popup window from your browser's toolbar or extensions menu.
3. The popup window should have a "Clip coupons" button. Click that to activate the clipping process.
   It will first load all coupons and then proceed to scroll one into view, click it, and repeat until there are no more clippable coupons.

>[!IMPORTANT]
>Leave your browser running undisturbed after activating the coupon clipping process.
>This is because extension works by sending debug-mode clicks to physical coordinates on your webpage.
>It will scroll a coupon into view, read its position, and then send a debug click to that position.
>If you adjust the window at all, the click event may miss. Furthermore, if you click off of the extension popup and cause it to close, the clipping process will be halted.
>The Safeway webpage checks if clicks events on the coupon buttons are "trusted", so attempting to click the button from the regular DOM API will not trigger the clip.
>For more details, see [How it works](#how-it-works).

4. Wait for the progress bar on the extension popup to disappear and be replaced with information on how many coupons had been successfully clipped.

>[!NOTE]
>You may occassionally get an error popup like this while the coupons are being clipped:
>
><img width="600px" alt="image" src="https://github.com/user-attachments/assets/4f92ad63-05f9-4db0-81ce-09d4754a6902" />
>
>This sometimes happens if coupons get clicked too quickly in succession.
>This extension will attempt to check if this error popup is present and dismiss it, so you do not need to interact with the popup yourself or manually intervene.

<br/>

## How it works

Until recently, there were many solutions for automatically clipping these coupons.
I previously used a Javascript snippet that basically performs the same logic as this extension.
However, the Safeway website recently had changes so that only "trusted" click events from the browser seem to activate the click events on the "clip" buttons.
This extension satisfies that requirement by using "Debug mode". You will see a banner that this extension has debug mode activated while it's clipping coupons.
While clipping, the extension is performing this loop:
* Search for the next clippable coupon on the page
* If there is a clippable coupon:
  * Scroll it into the viewport
  * Get its position in the viewport, and return the coordinates
  * Send a debug click event to those coordinates, which the browser sends as an actual human interface click rather than a Javascript console click (which is "untrusted")
  * Wait a random amount of time of about 1 second to prevent triggering the popup error.

Other pure-Javascript based solutions are still not working as of writing.
I'm not sure if some of the more sophisticated solutions that actually send HTTP requests to the coupon backend are still functioning since I couldn't be bothered to configure them.
This solution is quick and painless for my standards so just sharing in case others get some utility from it as well.
