import { registerDecorator } from 'class-validator';
import { valid } from 'semver';
export function IsSemver(validationOptions) {
    return function (object, propertyName) {
        registerDecorator({
            name: 'isSemver',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(version, _args) {
                    // Everything else is class-validator boilerplate, this is the real logic
                    return valid(version) !== null;
                },
            },
        });
    };
}
