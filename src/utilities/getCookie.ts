const getCookie = (cookieName: string) => {
    const cookies = document.cookie;

    const pattern = new RegExp(`(?<=${cookieName}=)[^;]+`, 'g');
    const cookie = cookies.match(pattern)?.[0];

    return cookie;
};

export default getCookie;
