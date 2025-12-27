const https = require('https');

https.get('https://pukapresscms.vercel.app/api/blogs?tenant=pukadigital', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Total blogs:', json.blogs?.length);
            if (json.blogs && json.blogs.length > 0) {
                console.log('Primer blog:', {
                    id: json.blogs[0].id,
                    title: json.blogs[0].title,
                    slug: json.blogs[0].slug,
                    status: json.blogs[0].status
                });
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
