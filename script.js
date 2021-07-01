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
  // imagesUrl: {
  //   query: "//*[@data-testid='product-name']",
  //   iterable: false,
  // },
  // isAvailable: {
  //   query: "//*[@data-testid='product-name']",
  //   iterable: false,
  // },
}

const checkElementAvailability = (productQueryValue, elementNode, itemAttributes) => {
  const productNotAvailableQueryEvaluated = document.evaluate(productQueryValue.notAvailableQuery, document, null, XPathResult.ANY_TYPE, null);
  notAvailableNode = productNotAvailableQueryEvaluated.iterateNext();
  while (notAvailableNode) {
    console.log(notAvailableNode.textContent, elementNode.textContent)
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
        itemAttributes[productQueryValue.label] = elementNode?.textContent
        if(productQueryValue.notAvailableQuery) {
          checkElementAvailability(productQueryValue, elementNode, itemAttributes)
        }
        ProductAttributes[productQueryKey].push(itemAttributes)
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

console.log(ProductAttributes)
