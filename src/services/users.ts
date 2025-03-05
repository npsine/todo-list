import axios, {AxiosResponse} from 'axios';
import {TransformedData, TransformObjectData, User} from "../types";

const API_URL = 'https://dummyjson.com/users';

const fetchUsers = async (): Promise<User[]> => {
    try {
        const response: AxiosResponse<{users: User[]}, any> = await axios.get<{ users: User[] }>(API_URL);
        return response.data.users;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

export const transformUsers = (users: User[]): TransformedData => {
    return users.reduce<TransformedData>((acc: TransformedData, user: User) => {
        const { firstName, lastName, age, gender, hair, address, company } = user;
        const department: string = company.department;

        if (!(department in acc)) {
            acc[department] = {
                male: 0,
                female: 0,
                ageRange: `${age}`,
                hair: {},
                addressUser: {},
            };
        }

        const deptData: TransformObjectData = acc[department];
        deptData[gender]++;

        const [minAge, maxAge] = deptData.ageRange.includes('-')
            ? deptData.ageRange.split('-').map(Number)
            : [Number(deptData.ageRange), Number(deptData.ageRange)];

        deptData.ageRange = (minAge === maxAge && minAge === age)
            ? `${age}`
            : `${Math.min(minAge, age)}-${Math.max(maxAge, age)}`;

        deptData.hair[hair.color] = (deptData.hair[hair.color] ?? 0) + 1;
        deptData.addressUser[`${firstName}${lastName}`] = address.postalCode ?? '';

        return acc;
    }, {});
};

(async () => {
    try {
        const users: User[] = await fetchUsers();
        const transformedData: TransformedData = transformUsers(users);
        console.log(transformedData);
    } catch (error) {
        throw new Error('Error fetching or transforming users:', error ?? '');
    }
})();
