/*const notificationId = 'safeway-coupon-clipper'

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
    const couponCard = document.querySelector('[id^="couponAddBtn"]')
    if (!couponCard) return null
    couponCard.scrollIntoView({block: "center"})
    const rect = couponCard.getBoundingClientRect()
    const couponCoordinate = { x: rect.left + (rect.width / 2),
                               y: rect.top + (rect.height / 2)}
    return couponCoordinate
}


async function clipProgressNotification(progress) {
    const notificationOptions = { message: "Coupons clipped",
                                  type:    "progress",
                                  title:   "Coupon clipper",
                                  iconUrl: "icon.png",
                                  buttons: [],
                                  progress }
    await chrome.notifications.create(notificationId, notificationOptions)
}


async function safewayClipCoupons(tab) {
    const target = { tabId: tab.id };
    try  { await chrome.debugger.attach(target, "1.2") } catch(e) {}

    let couponCoordinate = 1
    let couponsClipped = 0

    await chrome.scripting.executeScript({target, func: loadAllCoupons})

    const couponsTotal =
        (await chrome.scripting.executeScript({target, func: countCoupons}))[0].result ?? 1;

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
        await sleep(800)
        const progress = parseInt(100*(++couponsClipped) / couponsTotal)
        await clipProgressNotification(progress)
    }

    try { await chrome.debugger.detach(target) } catch(e) {}

    await chrome.notifications.create(notificationId,
                                      { message: `${couponsClipped} coupons clipped`,
                                        type:    "basic",
                                        title:   "Coupon clipper",
                                        buttons: [],
                                        iconUrl: "icon.png" })
}

chrome.action.onClicked.addListener(safewayClipCoupons)*/