/**
 * Get unique error field name
 */
const getUniqueErrorMessage = (err: any) => {
    let output;
    try {
        let fieldName = err.message.substring(
            err.message.lastIndexOf(".$") + 2,
            err.message.lastIndexOf("_1")
        );
        output =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1) +
            " already exists";
    } catch (ex) {
        output = "Unique field already exists";
    }

    return output;
};

/**
 * Get the error message from error object
 */
export const getErrorMessage = (err: any) => {
    let message = "";

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        // Mongoose validation errors
        for (let errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

/*
    Errors that are not thrown because of a Mongoose validator violation will contain an
    associated error code. In some cases, these errors need to be handled differently. For
    example, errors caused due to a violation of the unique constraint will return an
    error object that is different from Mongoose validation errors. The unique option is
    not a validator but a convenient helper for building MongoDB unique indexes, so we
    will add another getUniqueErrorMessage method to parse the unique constraintrelated error object and construct an appropriate error message.
*/
