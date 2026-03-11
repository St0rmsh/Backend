export async function registerController(req,res,next) {
    
    try {
    
    throw  new Error("Encounter an Error While Registering the User")

    } catch (error) {
        error.status = 500
        next(error)
        
    }
}