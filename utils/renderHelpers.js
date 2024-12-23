export const collections = ['all']
export const books = ['Dune'] 

// any data changes happen here via redirect on other controllers
export const renderWithData = (res, data = {}) => {
    console.log('rendering with data: ', data)
    res.render('main', 
    {
        layout: 'index',
        collections: collections,
        books: books,
        ...data
    })
}