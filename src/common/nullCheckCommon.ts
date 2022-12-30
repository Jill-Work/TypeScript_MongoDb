
export default class NullCheck {
    // null check function
     nullCheckWithDataValues = (data:any) => {
        if (data == null) {
            return null;
        } else {
            return data.dataValues;
        }
    };
    
     nullCheckWithOutDataValues = (data:any) => {
        if (data == null) {
            return null;
        } else {
            return data;
        }
    };

}


