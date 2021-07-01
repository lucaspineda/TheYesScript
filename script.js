const ProductAttributes = {}

const productQueries = {
  title: {
    query: "//*[@data-testid='product-name']",
    iterable: false,
  },
  information: {
    query: "//*[@data-testid='description-body']/div/p/text()[normalize-space()][1]",
    iterable: false,
  },
  color: {
    query: "//*[@class='_3otxU']",
    iterable: false,
  },
  sizes: {
    query: "//*[contains(@class, '_2_7UC')]",
    iterable: true,
    label: 'size',
    notAvailableQuery: "//*[contains(@class, 'm9yOG')]",
    deep: {
      notAvailable: "//*[contains(@class, 'm9yOG')]"
    }
  },
  price: {
    query: "//*[@data-testid='product-name']/following-sibling::span[@class='_3x-d1']",
    iterable: false,
  },
  imagesUrl: {
    query: "//*[contains(@class, '_2Smax')]//img",
    iterable: true,
    getSrc: true,
  },
  // Did not find any sold-out item to find a Xpath query for it :( 
  // SoldOut: {
  //   query: "",
  //   iterable: false,
  // },
}

const checkElementAvailability = (productQueryValue, elementNode, itemAttributes) => {
  const productNotAvailableQueryEvaluated = document.evaluate(productQueryValue.notAvailableQuery, document, null, XPathResult.ANY_TYPE, null);
  notAvailableNode = productNotAvailableQueryEvaluated.iterateNext();
  while (notAvailableNode) {
    if(notAvailableNode.textContent === elementNode.textContent) {
      itemAttributes.notAvailable = true
    }
    notAvailableNode = productNotAvailableQueryEvaluated.iterateNext();
  }
}

Object.entries(productQueries).forEach(productQuery => {
  const [productQueryKey, productQueryValue] = productQuery
  const productQueryEvaluated = document.evaluate(productQueryValue.query, document, null, XPathResult.ANY_TYPE, null);
  if(productQueryValue.iterable) {
    try {
      let elementNode = productQueryEvaluated.iterateNext();
      while (elementNode) {
        let itemAttributes = {}
        
        if(!ProductAttributes[productQueryKey]) {
          ProductAttributes[productQueryKey] = []
        }
        if(productQueryValue.notAvailableQuery) {
          itemAttributes[productQueryValue.label] = elementNode?.textContent
          checkElementAvailability(productQueryValue, elementNode, itemAttributes)
          ProductAttributes[productQueryKey].push(itemAttributes)
        }
        else if(productQueryValue.getSrc) {
          ProductAttributes[productQueryKey].push(elementNode?.src)
        }
        elementNode = productQueryEvaluated.iterateNext();
      }
    }
    catch (error) {
      alert( 'An error ocurred: ' + error );
    }
  } else {
    try {
      ProductAttributes[productQueryKey] = productQueryEvaluated.iterateNext()?.textContent;
    }
    catch(error) {
      alert( 'An error ocurred: ' + error );
    }
  }
});

console.log('JSON Result: \n' + JSON.stringify(ProductAttributes))


/* -------------------------------------------- snapshot test: -------------------------------------------- */
// visit https://www.31philliplim.com/pt/shopping/sleeveless-poplin-belted-midi-dress-16820575 to test
const expectedResult = {"title":"Sleeveless Poplin Belted Midi Dress","information":"\nCrewneck sleeveless cotton dress with a self-tie waist belt. Contrast topstitching. Shirred mid length skirt. Keyhole buttoned back closure.","color":"optic white","sizes":[{"size":"0"},{"size":"2"},{"size":"4"},{"size":"6"},{"size":"8"},{"size":"10"},{"size":"12"}],"price":"782,00 €","imagesUrl":["https://cdn-images.farfetch-contents.com/3-1-phillip-lim-sleeveless-poplin-belted-midi-dress_16820575_33601058_800.jpg?c=2","https://cdn-images.farfetch-contents.com/3-1-phillip-lim-sleeveless-poplin-belted-midi-dress_16820575_33602043_800.jpg?c=2","https://cdn-images.farfetch-contents.com/3-1-phillip-lim-sleeveless-poplin-belted-midi-dress_16820575_33601059_800.jpg?c=2"]}

if (location.href === "https://www.31philliplim.com/pt/shopping/sleeveless-poplin-belted-midi-dress-16820575") {
  if(JSON.stringify(ProductAttributes) === JSON.stringify(expectedResult)) {
    console.log('Test Passed')
  } else {
    console.log('Test Failed')
  }
}
