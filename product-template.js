// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction   
import { getProductByID } from "backend/getProduct.web.js"

import wixLocationFrontend from "wix-location-frontend";

import { sendEmailToAdmin, sendEmailToUser } from 'backend/Emails.web.js'
let product1;

let selectedSize = "";
let selectedColor = "";

$w.onReady(async function () {
    await producttt()
    wixLocationFrontend.onChange(async (location) => {

        await producttt()

    });

    async function producttt() {
        const product = await $w("#productPage1").getProduct();
        console.log("this is the Product :", product);
        $w('#productNameText').text = product.name;
        product1 = product.name;
        // $w('#productSkuText').text = product.sku;
        $w('#productDescriptionText').html = product.description;
        $w('#additionalText').html = product.additionalInfoSections[0].description;
        $w('#text106').html = product.additionalInfoSections[0].title;

        //product options , product option code will go here
        // after you’ve done `const product = await $w("#productPage1").getProduct();`
        const sizeChoices = product.productOptions.SIZE.choices
            .map(c => ({ label: c.description, value: c.value }));

        console.log("sizeChoices: ", product.productOptions);
        console.log("sizeChoices: ", sizeChoices);

        $w("#dropdown1").options = sizeChoices;

        // initialize to the first option
        selectedSize = sizeChoices[0]?.value || "";

        $w("#dropdown1").onChange(() => {
            selectedSize = $w("#dropdown1").value;
        });

        // 1) build the data with _id
        const rawColors = product.productOptions.COLOR.choices;
        const colorChoices = rawColors.map((c, i) => ({
            _id: `color-${i}`,
            description: c.description,
            value: c.value
        }));

        // 2) default selection
        let selectedColor = colorChoices[0]?.value || "";
        // 3) also track the name
        let selectedColorName = colorChoices[0]?.description || "";

        // 4) write default name into your text
        $w("#selectedColorName").text = selectedColorName;

        // 5) feed the repeater
        $w("#colorsrepeater").data = colorChoices;

        // 6) wire it up
        $w("#colorsrepeater").onItemReady(($item, itemData) => {
            const box = $item("#colorbox");

            // initial paint
            box.style.backgroundColor = itemData.value;
            box.style.borderStyle = "solid";
            box.style.borderWidth = itemData.value === selectedColor ? 2 : 1;
            box.style.borderColor = itemData.value === selectedColor ? "#000" : "transparent";

            // click → select only THIS one, clear all others, set text
            box.onClick(() => {
                selectedColor = itemData.value;
                selectedColorName = itemData.description;
                $w("#selectedColorName").text = selectedColorName;

                $w("#colorsrepeater").forEachItem(($ri, data) => {
                    const b = $ri("#colorbox");
                    b.style.borderStyle = "solid";
                    b.style.borderWidth = data.value === selectedColor ? 2 : 1;
                    b.style.borderColor = data.value === selectedColor ? "#000" : "transparent";
                });
            });
        });

        $w('#submitQuoteButton').onClick(() => {
            submitQuoteButton_click();
        })

        function submitQuoteButton_click() {
            const email = $w('#emailInput').value.trim();
            const message = $w('#messageInput').value;
            const size = selectedSize;
            const color = selectedColor;

            if (!email || !product1 || !message || !size || !color) {
                $w("#text104").text = "Please select all  the required fields";
                $w("#text104").expand();
                setTimeout(() => $w("#text104").collapse(), 3000);
                return;
            }

            // build a single details string
            const details = {
                "name": product1,
                "size": size,
                "color": color,
                "message": message,
                "email": email,

            };

            try {

                sendEmailToAdmin(details, "UiehaH8", "wixengine.com@gmail.com");
                sendEmailToAdmin(details, "UiehaH8", "ogenuma@yahoo.com");

                $w("#text104").text = "Request is submitted Successfully!";
                $w("#text104").expand();
                setTimeout(() => $w("#text104").collapse(), 3000);
                return;

            } catch (err) {
                console.error("Unexpected error:", err);
            }
        }

        $w("#gallery1").items = product.mediaItems;

        const productCollections = await getProductByID(product._id)
        console.log("productCollections", productCollections);
        const hasQuote = productCollections.some(item => item.name === "Maggie Sottero" || item.name === "Rebecca Ingram" || item.name === "Ivoire" || item.name === "Sottero & Midgley" || item.name === "Kitty Chen" || item.name === "Kitty Chen Couture" || item.name === "Pollardi" || item.name === "Ida Torez" || item.name === "Madam Burac" || item.name ==="Ariamo Boho" || item.name === "Madioni" || item.name === "Carfelli");
        console.log("hasQuote: ", hasQuote) 
        if (hasQuote) {
            $w("#getQuoteSection").expand();
            $w("#withoutquote").collapse();

        } else {
            console.log("XXXXXXXXXXXXXXXX")
            $w("#getQuoteSection").collapse();
            $w("#withoutquote").expand();

        }
    }

});