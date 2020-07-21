export function copyBoortrapAssets ({src,dest, env}){
if(env==='production'){
    return [
        {
            src: `${src}/bootstrap/dist/css/bootstrap.min.css`,
            dest,
          },
          {
            src: "node_modules/bootstrap/dist/js/bootstrap.min.js",
            dest: `builds/${process.env.appName}/build`,
          },
    
          {
            src: "node_modules/jquery/dist/jquery.min.js",
            dest: `builds/${process.env.appName}/build`,
          },
    ]

}
else{
    return [
        {
            src: `${src}/bootstrap/dist/css/bootstrap.min.css`,
            dest
          },
          {
            src: `${src}/bootstrap/dist/js/bootstrap.min.js`,
            dest
          },
    
          {
            src: `${src}/jquery/dist/jquery.min.js`,
            dest,
          },
    ]
}


}