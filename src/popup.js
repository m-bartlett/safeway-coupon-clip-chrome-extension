const notificationId = 'safeway-coupon-clipper'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function loadAllCoupons() {
    let btn
    do {
        btn = document.querySelector('button.load-more')
        btn?.scrollIntoView()
        btn?.click()
    } while (btn)
}


async function countCoupons() {
    return document.querySelectorAll('[id^="couponAddBtn"]').length
}


function getCouponCoordinateCard() {
    document.querySelector("div#errorModal")?.querySelector("button").click() // ignore error modal
    const couponCard = document.querySelector('[id^="couponAddBtn"]')
    if (!couponCard) return null
    couponCard.scrollIntoView({block: "center"})
    const rect = couponCard.getBoundingClientRect()
    const couponCoordinate = { x: rect.left + (rect.width / 2),
                               y: rect.top + (rect.height / 2)}
    return couponCoordinate
}


async function safewayClipCoupons() {
    // const target = { tabId: tab.id };

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const target = { tabId: tab.id };

    try  { await chrome.debugger.attach(target, "1.2") } catch(e) {}

    let couponCoordinate = 1
    let couponsClipped = 0

    await chrome.scripting.executeScript({target, func: loadAllCoupons})

    const couponsTotal =
        (await chrome.scripting.executeScript({target, func: countCoupons}))[0].result ?? 1;

    const progressBar = document.createElement('progress')
    const progressLabel = document.createElement('span')
    progressBar.value = 0
    progressBar.style.display = "block"
    progressBar.style.width = "100%"

    clipCouponButton.style.display = "none"
    document.body.appendChild(progressLabel)
    document.body.appendChild(progressBar)

    function updateProgress(couponsClipped) {
        progressLabel.innerText = `${couponsClipped} / ${couponsTotal}`
        progressBar.value = couponsClipped / couponsTotal
    }

    while (couponCoordinate) {
        const executionResult = await (chrome
                                       .scripting
                                       .executeScript({target, func: getCouponCoordinateCard}))
        const couponCoordinate = executionResult[0].result
        if (!couponCoordinate) break
        const {x, y} = couponCoordinate

        // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchMouseEvent
        const mouseOpts = {type: "mouseMoved", button: "left", x: x, y: y}
        await chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", mouseOpts)
        await sleep(1)
        mouseOpts.clickCount=1
        mouseOpts.type = "mousePressed"
        await chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", mouseOpts)
        await sleep(1)
        mouseOpts.type = "mouseReleased"
        await chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", mouseOpts)
        await sleep(800 + Math.random()*400)
        updateProgress(couponsClipped++)
    }

    try { await chrome.debugger.detach(target) } catch(e) {}

    progressBar.style.display = 'none'
    progressLabel.innerText = `${couponsClipped} coupons clipped`

}

const clipCouponButton = document.getElementById('clip-coupon-button')
clipCouponButton.addEventListener('click', safewayClipCoupons)