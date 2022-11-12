const recordList = document.getElementById('recordList')
const baseUrl = `${window.location.origin}/records`


const getAllRecords = async () => {
    try {
        const { data } = await axios.get(`${baseUrl}`)

        const albums = data.data.map((album) => {
            return `<div>
        <div>
            <h3>${album.title} (${album.releaseYear})</h3>
            <p class="close" onclick="deleteRecord('${album._id}')">&times;</p>
            <div>
                <p class="inline">${album.artistName}</p>
                <p>tracks: ${album.trackCount}</p>
            </div>
        </div>
        </div>`
        })
        recordList.innerHTML = albums.join('')
    } catch (error) {
        console.log(error)
        recordList.innerHTML = `<div>Something went wrong</div>`
    }
}
getAllRecords()

const saveRecord = async () => {
    const name = document.getElementById('name').value
    const title = document.getElementById('title').value
    const count = document.getElementById('count').value
    const year = document.getElementById('year').value

    if (name && title && count && year) {
        try {
            const { data } = await axios.post(`${baseUrl}/new`, {
                artistName: name,
                title: title,
                trackCount: count,
                releaseYear: year
            })
            location.reload()
        } catch (error) {
            console.log(error)
            recordList.innerHTML = `<div>Something went wrong</div>`
        }
    }
}


const deleteRecord = async (id) => {
    try{
        await axios.delete(`${baseUrl}/${id}`)
        location.reload()
    }
    catch (error) {
        console.log(error)
        recordList.innerHTML = `<div>Something went wrong</div>`
    }
}