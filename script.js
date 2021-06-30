const JSObject = {}

const productQueries = {
  title: {
    query: "//*[@data-testid='product-name']",
    iterable: false,
  },
  information: {
    query: "//*[@class='description-body']/div/p/text()[normalize-space()][1]",
    iterable: false,
  },
  color: {
    query: "//*[@class='_3otxU']",
    iterable: false,
  },
  // sizes: {
  //   query: "//*[@data-testid='product-name']",
  //   iterable: false,
  // },
  // price: {
  //   query: "//*[@data-testid='product-name']",
  //   iterable: false,
  // },
  // imagesUrl: {
  //   query: "//*[@data-testid='product-name']",
  //   iterable: false,
  // },
  // isAvailable: {
  //   query: "//*[@data-testid='product-name']",
  //   iterable: false,
  // },
}

Object.entries(productQueries).forEach(productQuery => {
  const [productQueryKey, productQueryValue] = productQuery
  const productQueryEvaluated = document.evaluate(productQueryValue.query, document, null, XPathResult.ANY_TYPE, null);

  JSObject[productQueryKey] = productQueryEvaluated.iterateNext()?.textContent;
  // console.log(productQueryEvaluated.iterateNext()?.textContent)
})

// const productTitleEvaluated = document.evaluate(queries.producTitle, document, null, XPathResult.ANY_TYPE, null);
// JSObject.productTitle = productTitleEvaluated.iterateNext().textContent;

console.log(JSObject)

// console.log(document.querySelectorAll('[data-testid="description-body"]'))