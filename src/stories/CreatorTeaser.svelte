<script lang="ts">
  import { profileImageFallback } from '$lib/static-content';
  import { twMerge } from 'tailwind-merge';
  
    /**
     * 
     */
    export let label: string = '';
    /**
     * Additional css classes
     */
    let clazz: string = '';
    export { clazz as class };
  
  </script>
  
<div class="flex flex-row backdrop-blur-sm bg-primary-purple1/[0.15] ring-primary-purple1/[0.15] rounded-full drop-shadow-md ring-2 ring-inset">
    <img class="basis-3/12 aspect-square rounded-full overflow-hidden drop-shadow-lg" src={profileImageFallback} alt="prifil"/>
    <div class="my-auto items-center basis-8/12 px-6 py-4 text-white space-y-4">
      <span class="font-bold">Name</span>
      <p class="line-clamp-2">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
    </div>
    <div class="absolute right-0 bottom-0 grid place-content-center h-12 w-12 rounded-full text-primary-purple-1 drop-shadow-md ring-2 ring-inset ring-primary-purple1/[0.15] bg-white  hover:bg-primary-purple1 hover:text-white">
      <a class="text-2xl font-bold" href="#">
        ...
      </a>
    </div>
</div>
