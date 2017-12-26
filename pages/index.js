/**
 * @since 20171226 16:17
 * @author vivaxy
 */

import Link from 'next/link';

export default () => (
    <div>
        Welcome to next.js!
        <Link href="/list">
            <a>go to list</a>
        </Link>
    </div>
);
